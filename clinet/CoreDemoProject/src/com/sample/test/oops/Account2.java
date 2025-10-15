package com.sample.test.oops;
// Implement encapsulation using a class 'Account' with private balance and accessors.
public class Account2 {
	private  int balance;

	public int getBalance() {
		return balance;
	}

	public void setBalance(int balance) {
		this.balance = balance;
	}

	public static void main(String[] args) {
		Account2 account =new Account2();
		account.setBalance(1000);
		System.out.println("The balance amount is:"+account.getBalance());
	}
}

