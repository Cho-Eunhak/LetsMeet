import * as React from "react";
import { Grid } from "@material-ui/core";
import { Header } from "../components";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";

export default class CreatePlan extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      planName: "",
      startTime: "",
      finishTime: "",
      timeInterval: "",
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    };
  }

  onRangeChange = (ranges) => {
    console.log(ranges);
    this.setState({
      startDate: ranges["selection"].startDate,
      endDate: ranges["selection"].endDate,
      key: ranges["selection"].key,
    });
  };

  render() {
    const { data, planName, startTime, finishTime, timeInterval } = this.state;
    //시작시간 배열
    const amTimes = new Array();
    for (let i = 1; i < 12; i++) {
      amTimes.push(i);
    }
    const amTimeList = amTimes.map((amTime) => (
      <option value="{amTime}:00">오전{amTime}시</option>
    ));
    //종료시간 배열
    const pmTimes = new Array();
    for (let i = 1; i < 12; i++) {
      pmTimes.push(i);
    }
    // pmTimes.unshift(12);
    const pmTimeList = pmTimes.map((pmTime) => (
      <option value="{pmTime + 12}:00">오후{pmTime}시</option>
    ));

    return (
      <Grid className="create-cont">
        <Header />
        <Grid className="create-cont-title">
          <h2>언제가 좋을까요?🤔</h2>
        </Grid>
        {/* 캘린더 */}
        <DateRange
          className="create-calendar"
          editableDateInputs={true}
          onChange={this.onRangeChange}
          moveRangeOnFirstSelection={false}
          ranges={[this.state]}
        />
        {/* 일정이름 */}
        <input
          className="create-name"
          type="text"
          value={planName}
          onChange={(e) => {
            this.setState({ planName: e.target.value });
          }}
          placeholder="일정 이름을 작성해주세요."
        />
        {/* 시간 정하기 */}
        <Grid className="create-time">
          <FormControl className="create-time-start">
            <InputLabel className="timeText">Start Time</InputLabel>
            <NativeSelect
              id="startTime"
              value={startTime}
              onChange={(e) => {
                this.setState({ startTime: e.target.value });
              }}
            >
              <option aria-label="None" value="" />
              <option value={"00:00"}>오전0시</option>
              {amTimeList}
            </NativeSelect>
          </FormControl>
          <Grid>~</Grid>
          <FormControl className="create-time-finish">
            <InputLabel className="timeText">Finish Time</InputLabel>
            <NativeSelect
              id="finishTime"
              value={finishTime}
              onChange={(e) => {
                this.setState({ finishTime: e.target.value });
              }}
            >
              <option aria-label="None" value="" />
              <option value={"12:00"}>오후12시</option>
              {pmTimeList}
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid className="create-interval">
          <FormControl>
            <InputLabel className="timeText">Interval</InputLabel>
            <NativeSelect
              id="timeInterval"
              value={timeInterval}
              onChange={(e) => {
                this.setState({ timeInterval: e.target.value });
              }}
            >
              <option aria-label="None" value="" />
              <option value={15}>15분</option>
              <option value={30}>30분</option>
              <option value={60}>1시간</option>
            </NativeSelect>
          </FormControl>
          <Grid>단위</Grid>
        </Grid>
        {/* 일정생성 버튼 */}
        <Grid className="create-plan-btn">
          <a href="#" className="create-plan-text">
            일정 생성하기
          </a>
        </Grid>
      </Grid>
    );
  }
}
