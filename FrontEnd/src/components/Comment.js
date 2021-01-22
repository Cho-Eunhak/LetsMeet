  
import React, { useState, useEffect } from 'react';
import Commentitem from './Commentitem';
import axios from 'axios';
import { Button } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const Comment = ({match, isloggedin}) => {
	const [comments, setcomments] = useState(null);
	const [text, settext] = useState('');

	/*const comments
	=[{"userId":"user222","userKey":2098202681,"content":"ㅎㅎㅎㅎㅎㅎㅎ","created":"2021-01-20T01:50:25.915"},
	{"userId":"user111","userKey":1894261334,"content":"ㅋㅋㅋㅋㅋ","created":"2021-01-20T01:51:10.426"},
	{"userId":"user11","userKey":2076160027,"content":"This is your comment.","created":"2021-01-21T01:50:41.112"}]*/
	const onChange = (e) => {
		settext(e.target.value);
	  };
		const fetchComments = async () => {
			await axios.get(`https://letsmeeet.azurewebsites.net/api/comment`)
			.then((res)=>{
				setcomments(res.data);
			})
			.catch((err)=>{
			const status = err?.response?.status;
			if (status === undefined) {
				console.dir("데이터를 불러오던 중 예기치 못한 예외가 발생하였습니다.\n" + JSON.stringify(err));
			}
			else if (status === 400) {
				console.dir("400에러");
			}
			else if (status === 401) {
				console.dir("401에러");
			}
			else if (status === 500) {
				console.dir("내부 서버 오류입니다. 잠시만 기다려주세요.");
			}
			});
	};
	useEffect(() => {
		fetchComments();
	  }, [isloggedin]);
	
	const handlesubmit = (e) => {
		e.preventDefault();
		const data = {
		  "content": text,
		}
		axios
		  .post('https://letsmeeet.azurewebsites.net/api/comment', data)
		  .then(function (response) {
			console.log(response);
		  })
		  .catch(function (error) {
			console.log(error);
			const status = error?.response?.status;
			if (status === undefined) {
			  console.dir(
				"데이터를 불러오던 중 예기치 못한 예외가 발생하였습니다.\n" +
				  JSON.stringify(error)
			  );
			} else if (status === 400) {
			  console.dir("400에러");
			} else if (status === 500) {
			  console.dir("내부 서버 오류입니다. 잠시만 기다려주세요.");
			}
		  });
	  };
	
	return (
		<div>
			<text className="title">
				댓글
				<img className="img" src="/img/comment.png"/>
			</text>
			
			<span className="midbtn">
				<Button variant="contained" color="primary" className="btn save" onChange={onChange} onClick={handlesubmit}>저장</Button>
			</span>
			<div className="commentbox">
				<br />
				<table className="table">
					<tbody>
						{comments && comments.map(comment => {
							return <Commentitem key={comment.userId} id={comment.userId} name={comment.userId} description={comment.content} />
						})}
					</tbody>
				</table>
				<br />
				</div>
				<div className="commentinputbox">
				<span className="saveicon" onClick={handlesubmit}><i className="fa fa-arrow-up"></i></span>
				<input className="commentinput" onChange={onChange} placeholder="로그인 후 댓글을 적어주세요">
				</input>
				</div>
		</div>
	);
}
export default Comment;