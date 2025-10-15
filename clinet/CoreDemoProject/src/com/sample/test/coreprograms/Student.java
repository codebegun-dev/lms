package com.sample.test.coreprograms;

public class Student {
	String name;
	int age;
	
	Student(){
		name="Default";
		age=0;
		}
	Student(String n,int a){
		name=n;
		age=a;
	}

	void display() {
		System.out.println(name+ " "+age);
	}
	public static void main(String[] args) {
		Student student=new Student();
		Student student1=new Student("Manasa",20);
		student.display();
		student1.display();
	}
}
