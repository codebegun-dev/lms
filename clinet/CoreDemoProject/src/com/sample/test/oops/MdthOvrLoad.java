package com.sample.test.oops;

public class MdthOvrLoad {
void details() {
	System.out.println("Enter your details");
}
void details(String name) {
	System.out.println("My name is "+name);
}
void details(int age,String email) {
	
	System.out.println("My age is"+age);
}
void details(String clg,String branch) {
	
	System.out.println("My clg is"+clg);
	System.out.println("I am from"+branch);
	
	
}

	public static void main(String[] args) {
		MdthOvrLoad methodOvrLd=new MdthOvrLoad();
		methodOvrLd.details();
		methodOvrLd.details("manasa");
		methodOvrLd.details(21, "manasagovada21@gmail.com");
		methodOvrLd.details("Nimra", "cse-ds");
		
		

	}

}
