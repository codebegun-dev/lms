package com.sample.test.testprograms;

public interface MethodOvrLoading {
	void student();
	 void student(int age);
	 void student(String name,String Gender);
  
}
class Student implements MethodOvrLoading {
	
	public void student() {
		System.out.println("I am student");
	}
	 public void student(int age) {
		System.out.println("Student age is :"+age);
	}
	 public void student(String name,String Gender) {
		System.out.println("Student name is :"+name);
		System.out.println("The student gender is:" +Gender);
	}
	 public static void main(String[] args) {
		Student stud=new Student();
		stud.student();
		stud.student(21);
		stud.student("Manasa","Female");
		
		
	}
}
