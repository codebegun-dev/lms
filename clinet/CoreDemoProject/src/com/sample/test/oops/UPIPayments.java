package com.sample.test.oops;

public interface UPIPayments {
	 String transaction();
	 int pin();
	 String balanceCheck();

}
class Account implements UPIPayments{
	 public String transaction() {
		System.out.println("The transaction is completed through phonepe");
		return "The transaction is completed through phonepe";
	}
	 public int pin() {
		System.out.println("Your pin is 2545");
		return 2545;
	}
	 public String balanceCheck() {
		 System.out.println("Your balance is 36273");
		 return "Your balance is 36273";
	 }
	public static void main(String[] args) {
		
		Account account=new Account();
		account.transaction();
		account.pin();
		account.balanceCheck();
		
		
	}
}