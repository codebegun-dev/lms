package com.sample.test.demo;

import java.util.Scanner;

public class Employee {
	public void details () {
		Scanner sc=new Scanner(System.in);
		System.out.println("Enter your name");
		sc.nextLine();
		System.out.println("Enter your age");
		sc.nextInt();
		System.out.println("Enter your email");
		sc.next();
		System.out.println("My name is"+sc.nextLine()+"My age is"+ sc.nextInt()+ "My email is"+sc.next());
		
		
	}

}
