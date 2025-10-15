package com.sanple.test.COREPrgms;


public class Main {
public static void main(String[] args) {
User user = new User(1000.0); // Initial balance ₹1000 
ATM atm = new ATM(user);
atm.start();
}
}