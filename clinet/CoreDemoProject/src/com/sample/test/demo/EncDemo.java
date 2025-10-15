package com.sample.test.demo;

import java.util.Scanner;

class Student{
	private  String Name;
	public String getName() {
		return Name;
	}
	public void setName(String name) {
		Name = name;
	}
	public Long getMobile() {
		return Mobile;
	}
	public void setMobile(Long mobile) {
		Mobile = mobile;
	}
	public String getEmail() {
		return Email;
	}
	public void setEmail(String email) {
		Email = email;
	}
	public String getCourse() {
		return Course;
	}
	public void setCourse(String course) {
		Course = course;
	}
	public int getYOP() {
		return YOP;
	}
	public void setYOP(int yOP) {
		YOP = yOP;
	}
	public char getGender() {
		return Gender;
	}
	public void setGender(char gender) {
		Gender = gender;
	}
	@Override
	public String toString() {
		return "Student [Name=" + Name + ", Mobile=" + Mobile + ", Email=" + Email + ", Course=" + Course + ", YOP="
				+ YOP + ", Gender=" + Gender + "]";
	}
	private Long Mobile;
	private String Email;
	private String Course;
	private int YOP;
	private char Gender;
} 
class Address{
	private Long DNo;
	private String Buliding_Name;
	private String District;
	private String City;
	private String State;
	public Long getDNo() {
		return DNo;
	}
	public void setDNo(Long dNo) {
		DNo = dNo;
	}
	public String getBuliding_Name() {
		return Buliding_Name;
	}
	public void setBuliding_Name(String buliding_Name) {
		Buliding_Name = buliding_Name;
	}
	public String getDistrict() {
		return District;
	}
	public void setDistrict(String district) {
		District = district;
	}
	public String getCity() {
		return City;
	}
	public void setCity(String city) {
		City = city;
	}
	public String getState() {
		return State;
	}
	public void setState(String state) {
		State = state;
	}
	
	
	
	
}

public class EncDemo {

	public static void main(String[] args) {
		
		Student student=new Student();
		//Student student1=new Student();
		Scanner scanner=new Scanner(System.in);
		//Student[] studentArray=new Student[10];
		System.out.println("Please enter your details :" +"Name:,Mobile,Email,Course");
		student.setName(scanner.next());
		student.setMobile(scanner.nextLong());
		student.setEmail(scanner.next());
		student.setCourse(scanner.next());
		//studentArray[0]=student;
		//System.out.println(student.getName());
		//System.out.println(studentArray[0]);
		//System.out.println(student.getName());
		//System.out.println(student1.getName());
		//for(int i=0;i<studentArray.length;i++) {
		//	System.out.println(studentArray[i]);
		//if(student.getName().equals("Manasa")) {
		//System.out.println("Equals");
		//}
		System.out.println(student.getName());
		System.out.println(student.getMobile());
		System.out.println(student.getEmail());
		System.out.println(student.getCourse());
		
		}

	}


