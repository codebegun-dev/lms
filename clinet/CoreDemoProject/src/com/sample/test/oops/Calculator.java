package com.sample.test.oops;
//Demonstrate method overloading in a Calculator class.
public class Calculator {
	void clac() {
		System.out.println("This is aCalculator");
		
	}
	int calc(int a,int b) {
		
		return (a+b);
		
	}
	int calc(int c,int d,int e) {
		
		
		return c*d*e;
	}
	public static void main(String[] args) {
		 int c=32;
		 int d=32;
		 int e=32;
		Calculator calculator=new Calculator();
		calculator.clac();
		System.out.println("The sum is:" +calculator.calc(3, 4));
		System.out.println("The product of :" +c+" "  +d +" "+e+" " +" is " +calculator.calc(c,d,e));
	}

}
