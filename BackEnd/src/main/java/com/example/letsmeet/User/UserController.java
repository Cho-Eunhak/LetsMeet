package com.example.letsmeet.User;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.letsmeet.Meet.Meet;
import com.example.letsmeet.Time.UserInfo;

@RestController
@RequestMapping(value="/user")
public class UserController {

	@Resource
	private UserInfo userInfo;
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	private Meet queryMeet;
	private String message;
	private HttpStatus status;
	private User queryUser;
	
	@PostMapping("signin")
	public ResponseEntity<?> newUser(HttpSession session, @RequestBody User newbie) {
		
		//유저 검증. 
		
		switch(checkUser(newbie)) {
			case 0 :
				
				message = "해당 링크가 존재하지 않습니다.";
				status = HttpStatus.UNAUTHORIZED;
				//return new ResponseEntity<>("해당 링크가 존재하지 않습니다.", HttpStatus.BAD_REQUEST);
		
			case 2 :
				
				message = "비밀번호가 일치하지 않습니다.";
				status = HttpStatus.UNAUTHORIZED;
				return new ResponseEntity<String>(message, status);
				
			case 1 :
				
				//새로운 유저. 
				int col = (queryMeet.getEnd()-queryMeet.getStart());
				col = (int)(60 / queryMeet.getGap()) * col;
				int row = queryMeet.getDates().size();
				
				
				int[][] userTime = new int[col][row];
				newbie.setUserTimes(userTime);
				newbie.setUserKey(Math.abs(newbie.hashCode()));
				mongoTemplate.insert(newbie,"user").hashCode();
				
				Query query = new Query();
				query.addCriteria(Criteria.where("meetId").is(newbie.getMeetId()));
				
				Update update = new Update();
				update.inc("num", 1);
				update.push("users",newbie.getUserKey());
				
				mongoTemplate.updateFirst(query, update, "meet");
				
				userInfo.setUser(newbie);
				message = "아이디 생성 완료.";
				status = HttpStatus.CREATED;
				break;
			
			
				
			case 3 :
				
				Meet meet = newbie.getMeet(mongoTemplate, newbie.getMeetId());
				message = session.getId();
				session.setAttribute("yours", queryUser);
				status = HttpStatus.OK;
				userInfo.setUser(queryUser);
				
				break;
		}
		
		
		
		userInfo.setMeetId(queryMeet.getMeetId());
		userInfo.setGap(queryMeet.getGap());
		userInfo.setDates(queryMeet.getDates());
		
		
				
		return new ResponseEntity<String>(message, status);
		
	}
	
	public int checkUser(User user) {
		
		
		Query query = new Query();
		query.addCriteria(Criteria.where("meetId").is(user.getMeetId()));
		
		queryMeet = mongoTemplate.findOne(query, Meet.class, "meet");
		
		if(queryMeet==null) return 0;
		
		query.addCriteria(Criteria.where("userId").is(user.getUserId()));

		queryUser = mongoTemplate.findOne(query, User.class, "user");
		
		if(queryUser == null ) return 1;
		
		query.addCriteria(Criteria.where("userPass").is(user.getUserPass()));
		
		queryUser = mongoTemplate.findOne(query, User.class, "user");
		
		if(queryUser == null) return 2;
		
		
		return 3;
		
	}
	
	@GetMapping("session")
	public String get() {
		return userInfo.toString();
	}
	
	
}
