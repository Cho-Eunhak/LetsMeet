import React, {useState, useEffect} from 'react';
import { Grid } from '@material-ui/core'
import axios from 'axios';
const Top3 = ({isloggedin}) => {
    /*const timedata = [
        "12/31 (목)\n03:30 오후",
        "01/02 (토)\n07:30 오후",
        "12/31 (목)\n07:30 오후"
        ]*/
    const [timedata, settimedata] = useState('');
    	useEffect(()=>{
			axios.get(`https://letsmeeet.azurewebsites.net/api/time/topN`)
			.then((res)=>{
				settimedata(res.data);
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
	}, [isloggedin]);
	
return (
    <div>
         <div className="title">TOP 3 <img className="img" alt='top3' src="/img/top3.png"></img></div>
        <Grid container >
        <Grid item xs={2} >
        <div className="first">1위 </div>
        </Grid>
        <Grid item xs={2}>
        <div className="desc">{timedata[0]} </div>
        </Grid>
        <Grid item xs={2}>
        <div className="second">2위 </div>
        </Grid>
        <Grid item xs={2}>
        <div className="desc">{timedata[1]} </div>
        </Grid>
        <Grid item xs={2}>
        <div className="third">3위 </div>
        </Grid>
        <Grid item xs={2}>
        <div className="desc">{timedata[2]} </div>
        </Grid>
        </Grid>
        <br />
    </div>
)
}

export default Top3;
