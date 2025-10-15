package com.sample.test.coreprograms;

public class ConstructorOvr {
int a;
int b;
String name;
int age;

ConstructorOvr() {
	System.out.println("I am constructor1");
}
 ConstructorOvr(int a,int b) {
	 this.a=a;
	 this.b=b;
	System.out.println("I am integer a"+a);
	System.out.println("I am integer b"+b);
}
ConstructorOvr(String name,int age) {
	this.name=name;
	this.age=age;
	System.out.println("I am the string name"+name);
	System.out.println("I am the integer age"+age);
}
public static void main(String[] args) {
	ConstructorOvr constructor1=new ConstructorOvr();
	ConstructorOvr constructor2=new ConstructorOvr(2,4);
	ConstructorOvr constructor3=new ConstructorOvr("manasa",21);
	
	}
}
