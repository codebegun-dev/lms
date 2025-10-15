package com.sample.test.demo;

import java.util.Scanner;

public class ConstScnrInput {

	ConstScnrInput(){
		Scanner sc=new Scanner(System.in);
		System.out.println("Enter your name :");
		String name=sc.nextLine();
		System.out.println("My name is "+name);
		
	}
	ConstScnrInput(int age){
		Scanner sc1=new Scanner(System.in);
		System.out.println("Enter your age :");
		age=sc1.nextInt();
		System.out.println("My age is "+age);
		
		
	}
	public static void main(String[] args) {
		 new ConstScnrInput();
		 new ConstScnrInput(0);

	}

}
