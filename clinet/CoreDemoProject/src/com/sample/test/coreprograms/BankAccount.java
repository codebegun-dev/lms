package com.sample.test.coreprograms;

import java.util.Scanner;

public class BankAccount {
int balance=1000;
public void withdraw(int amount) {
	if(amount<=balance) {
		
		balance-=amount;
		System.out.println("Withdrawn amount:" +amount);
	}
	 else{
		System.out.println("Insuffecient Balance");
	 }}
	
	void deposit(int amount) {
		balance+=amount;
		System.out.println("The deposited amount is :"+balance);
		
	}
	void checkBalance() {
		System.out.println("The remaining balance is:"+balance);
	}
	
}
class ATM{
	public static void main(String args[]) {
	BankAccount bankaccount=new BankAccount();
	Scanner sc=new Scanner(System.in);
	System.out.println("Enter the amount");
	 int amount=sc.nextInt();
	bankaccount.withdraw(amount);
	System.out.println("Enter the deposited amount");
	
	bankaccount.deposit(sc.nextInt());
	bankaccount.checkBalance();
}
}
