package com.sample.test.demo;

public class HirInputB extends HirInputA{
public void h2() {
	System.out.println("Hierachial Input B");
}
public static void main(String[] args) {
	 HirInputB  hirInputB=new  HirInputB();
	 hirInputB.h1();
	 hirInputB.h2();
}
}
