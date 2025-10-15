package com.sanple.test.COREPrgms;


public class User { 
private double balance;
public User(double initialBalance) { 
this.balance = initialBalance;
}
public void checkBalance() {
System.out.println("Your current balance is: ₹" + balance);
}
public void deposit(double amount) { 
if (amount > 0) {
balance += amount;
System.out.println("Successfully deposited ₹" + amount);

} else {
System.out.println("Invalid deposit amount.");
}
}
public void withdraw(double amount) {
if (amount > 0 && amount <= balance) { 
balance -= amount;
System.out.println("Successfully withdrawn ₹" + amount);
} else {
System.out.println("Insufficient balance or invalid amount.");
}
}
}