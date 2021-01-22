import React, { useState, useEffect } from "react";
import html2canvas from 'html2canvas';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CLIENT_ID } from '../config';
import axios from 'axios';


import { Header, TimeTable, Comment, Yookha, Top3, ShareModal, Findmidplace } from "../components";

import { Grid, Button } from '@material-ui/core';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

const ManagePlan = ({ match }) => {
	const [data, setData] = useState();
	const [shareImg, setShareImg] = useState("");
	const [open, setOpen] = useState(false);
	const [checkUser, setCheckUser] = useState();
	const [checkGroup, setCheckGroup] = useState();
	const [user, setUser] = useState();
	
	const [isloggedin, setloggedin] = useState(false);
	const [logininput, setlogininput] = useState({
		id: '',
		pw: '',
	});
	const { id, pw } = logininput;
	const onChange = (e) => {
		const { value, name } = e.target;
		setlogininput({
			...logininput,
			[name]: value
		});
	};

	useEffect(() => {
		if(!match.url)
			return;
		getData(match.url.substr(1));
	}, [match.url]);
	const [senddata, setsenddata] = useState([]);
	const getData = async (url) => {
		await axios.get(`https://letsmeeet.azurewebsites.net/api/meet/info?id=${url}`)
		.then((res) => {
			console.log(res.data);
			setData(res.data);
			setCheckUser(res.data.userTime);
			setCheckGroup(res.data.checkArray);
			setUser(res.data.users);
			setsenddata(res.data.meetSubInfo);
		})
		.catch((err) => {
			const status = err?.response?.status;
			console.log(err);
			if (status === undefined) {
				console.dir("데이터를 불러오던 중 예기치 못한 예외가 발생하였습니다.\n" + JSON.stringify(err));
			}
			else if (status === 400) {
				console.dir("400에러");
			}
			else if (status === 404) {
				console.dir("404에러");
			}
			else if (status === 500) {
				console.dir("내부 서버 오류입니다. 잠시만 기다려주세요.");
			}
		});
	};

	const onLogin = (e) => {
		if (id === '' || pw === '') {
			alert('닉네임과 패스워드를 입력해주세요');
		}
		else {
			const data = {
				"userId": logininput.id,
				"userPass": logininput.pw,
				"meetId": match.url.substr(1)
			}
			axios.post(`https://letsmeeet.azurewebsites.net/api/user/signin`, data)
				.then((res) => {
					setloggedin(true);
				})
				.catch((err) => {
					const status = err?.response?.status;
					console.log(err);
					if (status === undefined) {
						console.dir("데이터를 불러오던 중 예기치 못한 예외가 발생하였습니다.\n" + JSON.stringify(err));
					}
					else if (status === 400) {
						alert("");
						console.dir("400에러");
					}
					else if (status === 404) {
						alert("404");
						console.dir("404에러");
					}
					else if (status === 500) {
						console.dir("내부 서버 오류입니다. 잠시만 기다려주세요.");
					}
				});

		}
	};

	const copyDOM = async () => {
		window.scrollTo(0, 0);

		let url = "";
		await html2canvas(document.getElementById("teamtable")).then(async (canvas) => {
			url = await canvas.toDataURL("image/jpg").split(',')[1];
			setOpen(true);
		});

		await uploadImgur(url);
	}

	const copyURL = () => {
	}

	const uploadImgur = (url) => {
		const apiBase = 'https://api.imgur.com/3/image';
		axios.post(apiBase, {
			image: url,
			type: 'base64'
		}, {
			headers: {
				Authorization: 'Client-ID ' + CLIENT_ID
			}
		})
			.then(res => {
				setShareImg(res.data.data.link);
			})
			.catch(e => {
				console.log(e);
			})
	}

	const handleClose = () => {
		setOpen(false);
		setShareImg("");
	};

	return (
		<Grid container direction="column" className="Manage-page-con">
			<Header />
			{isloggedin && 
				<Grid className="Manage-plan-title">
					<img className="img" src="/img/alarm.png" />
					<h2>{data.title}</h2>
				</Grid>
			}
			{data ?
				<Grid container direction="row" className="Manage-contents-con">
					{isloggedin ? 
					<TimeTable
						data={data}
						type="mine"
						checkUser={checkUser}
						checkGroup={checkGroup}
						setCheckGroup={setCheckGroup}
						user={user}
					/> : <Grid container direction="row" justify="center" alignItems="center" className="login-con">
							<div className="login-flex-container">
								<div className="title">
									<img className="img" src="/img/alarm.png" />
									<p>{data.title}</p>
								</div>
								<div className="form-con">
									<div>
										<text className="nickname">닉네임 : </text>
										<input className="logininput" name="id" onChange={onChange} value={id} />
									</div>
									<div>
										<text className="nickname">비밀번호 : </text>
										<input className="logininput" name="pw" type="password" onChange={onChange} value={pw} />
									</div>
								</div>
								<div className="extra-con">
									<text className="notice">*닉네임과 비밀번호는 현재 일정에만 사용됩니다.</text>
									<Button variant="contained" color="primary" onClick={onLogin}>로그인</Button>
								</div>
							</div>
						</Grid>}
					{ 
						user && checkGroup &&
						<TimeTable
							data={data}
							type="team"
							checkUser={checkUser}
							checkGroup={checkGroup}
							setCG={setCheckGroup}
							user={user}
						/>
					}
					<Grid container className="yook-ha-con" direction="column" justify="flex-start" alignItems="stretch">
						<Top3 isloggedin={isloggedin}></Top3>
						<Yookha senddata={senddata}></Yookha>
						<Findmidplace></Findmidplace>
						<Comment isloggedin={isloggedin}></Comment>
						<Grid className="btn-con">
							<Button variant="contained" color="primary" onClick={copyDOM}>카카오톡 공유하기</Button>
							<CopyToClipboard text={window.location.href} onCopy={() => window.alert("링크가 복사되었습니다.")}>
								<Button variant="contained" color="primary" onClick={copyURL}>링크 복사하기</Button>
							</CopyToClipboard>
						</Grid>
					</Grid>
					<ShareModal
						shareImg={shareImg}
						open={open}
						handleClose={handleClose}
					/>
				</Grid>
				: "로딩중입니다."
			}
		</Grid>
	);
};

export default ManagePlan;
