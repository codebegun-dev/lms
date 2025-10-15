package com.sanple.test.COREPrgms;
import java.util.Scanner; 
public class ATM {
private User user;
private Scanner sc;
public ATM(User user) { 
this.user = user;
this.sc = new Scanner(System.in);
}
public void start() { 
	int choice;
do {
System.out.println("\n==== ATM Menu ===="); 
System.out.println("1. Check Balance"); 
System.out.println("2. Deposit Money"); 
System.out.println("3. Withdraw Money"); 
System.out.println("4. Exit"); 
System.out.print("Enter your choice: ");
choice = sc.nextInt();
switch (choice) { 

 case 1: user.checkBalance();
 break;
case 2:
System.out.print("Enter amount to deposit: ₹"); 
double depositAmount = sc.nextDouble(); 
user.deposit(depositAmount); 
break; 
case 3:
System.out.print("Enter amount to withdraw: ₹"); 
double withdrawAmount = sc.nextDouble(); 
user.withdraw(withdrawAmount);
break; 
case 4:
System.out.println("Thank you for using ATM. Goodbye!"); 
break;
default:
System.out.println("Invalid choice! Please select from 1 to 4.");
}
}
while (choice != 4);
sc.close();
}
}
