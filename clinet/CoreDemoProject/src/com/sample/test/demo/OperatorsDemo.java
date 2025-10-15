package com.sample.test.demo;

public class OperatorsDemo {

	public static void main(String[] args) {
		int a,b;
		a=3;
		b=6;
		System.out.println("The value of:"+a +"+"+b+"="+(a+b));
		System.out.println("The value of:"+a +"-"+b+"="+(a-b));	
		System.out.println("The value of:"+a +"*"+b+"="+(a*b));
		System.out.println("The value of:"+a +"/"+b+"="+(a/b));
		System.out.println("The value of:"+a +"%"+b+"="+(a%b));
		a=10;
		b=20;
		System.out.println("Unary Operators.......");
		System.out.println("The pre incr of " +a +"=" +(++a));
		System.out.println("The post incr of " +a +"=" +(a++) + " after action " +a);
		System.out.println("The post dec of " +b +"=" +(b--) + " after action " +b);
	System.out.println("The pre dec of " +b +"=" +(--b));
a=6;
	int c=6;
System.out.println("Assignment Operators..... ");
System.out.println("The value of " +a  +"+=" +c +"=" +(a+=c));
System.out.println("The value of " +b  +"-=" +c +" =" +(b-=c));
System.out.println("The value of " +c  +"*=" +c +" =" +(c*=c));
System.out.println("The value of " +c  +"/=" +c +" =" +(c/=c));
System.out.println("The value of " +c +"%=" +c +"=" +(c%=c));
System.out.println("Logical Operators....");
a=2;b=4;
System.out.println("The value of " +(+a+">"+b) + " && "+ (+b+">"+a) +" = " +((a>b)&&(b>a)));
System.out.println("The value of " +(+a+">"+b) + " || "+ (+b+">"+a) +" = " +((a>b)||(b>a)));
System.out.println("The value of " +(+a+">"+b) + " ! "+ (+b+">"+a) +" = " +(!((a>b)||(b>a))));
System.out.println("Relational operators.....");
a=5;b=2;
System.out.println("The value of " +a +">" +b +" = " +(a>b));
System.out.println("The relation of " +a +"<" +b +" = " +(a<b));
System.out.println("The value of " +a +">=" +b +" = " +(a>=b));
System.out.println("The value of " +a +"<=" +b +" = " +(a<=b));
System.out.println("The value of " +a +"==" +b +" = " +(a==b));
System.out.println("The value of " +a +"!=" +b +" = " +(a!=b));
	
	
	}
	

}
