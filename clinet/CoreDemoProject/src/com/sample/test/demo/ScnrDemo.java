package com.sample.test.demo;

import java.util.Scanner;

public class ScnrDemo {
	 
	
	 static int add() {
		 Scanner sc=new Scanner(System.in);
		 System.out.println("Enter the value 1:::");
		 int a=sc.nextInt();
		 System.out.println("Enter the value 2:::");
		 int b=sc.nextInt();
		 System.out.println("The addition of " +a +" and " +b +"is :");
		 return a+b;
		 }
	  static int sub() {
		 Scanner sc=new Scanner(System.in);
		 System.out.println("Enter the value 1:::");
		 int a=sc.nextInt();
		 System.out.println("Enter the value 2:::");
		 int b=sc.nextInt();
		 System.out.println("The substraction of " +a +" and " +b +"is :");
		 return a-b;
		 }
	  static int mul() {
			 Scanner sc=new Scanner(System.in);
			 System.out.println("Enter the value 1:::");
			 int a=sc.nextInt();
			 System.out.println("Enter the value 2:::");
			 int b=sc.nextInt();
			 System.out.println("The multiplication of " +a +" and " +b +"is :");
			 return a*b;
			 }
	  static int even() {
			 Scanner sc=new Scanner(System.in);
			 System.out.println("Enter the value :::");
			 int a=sc.nextInt();
			 System.out.println("Enter the value 2:::");
			 int b=sc.nextInt();
			 System.out.println("The multiplication of " +a +" and " +b +"is :");
			 return a*b;
			 }

	public static void main(String[] args) {
	
		Scanner sc =new Scanner(System.in);
		System.out.println("add==1");
		System.out.println("sub==2");
		System.out.println("mul==3");
		System.out.println("Select the operation");
	int option =sc.nextInt();
		 if(option==1) {
			 System.out.println(add());
		 }else if(option==2){
			 System.out.println(sub());
		 }else if(option==3) {
			 System.out.println(mul());
		 }
		  
		
	}

}
