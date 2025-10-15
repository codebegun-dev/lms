package com.sample.test.oops;

public interface UPIPayments2 {
	String transaction();
	int pin();
	String balanceCheck();

}
class Account1 {
	void welcome() {
		System.out.println("Welcome");
	}
	
}
class Phonepe extends  Account1 implements UPIPayments2{
	void welcome() {
		System.out.println("Welcome to phonepe");
	}
	 public String transaction() {
		return "Your transaction is done through phonepe";
	}
	 public int pin() {
		 return 5432;
	 }
	 public String balanceCheck() {
		 return "Your phonepe account balance is 50k";
	 }
}

class Googlepay implements UPIPayments2 {
	 public String transaction() {
			return "Your transaction is done through Googlepay";
		}
		 public int pin() {
			 return 5542;
		 }
		 public String balanceCheck() {
			 return "Your phonepe account balance is 60k";
		 }
}

class Paytm implements UPIPayments2 {
	 public String transaction() {
			return "Your transaction is done through Paytm";
		}
		 public int pin() {
			 return 5452;
		 }
		 public String balanceCheck() {
			 return "Your phonepe account balance is 90k";
		 }

}
class Main{

public static void main (String args[]) {
	
	Phonepe phonepe=new Phonepe();
	phonepe.welcome();
	System.out.println(phonepe.transaction());
	System.out.println(phonepe.pin());
	System.out.println(phonepe.balanceCheck());
	UPIPayments2 upi;
	upi=new Googlepay();
	System.out.println(upi.transaction());
	System.out.println(upi.pin());
	System.out.println(upi.balanceCheck());
	upi=new Paytm();
	System.out.println(upi.transaction());
	System.out.println(upi.pin());
	System.out.println(upi.balanceCheck());
}
}
