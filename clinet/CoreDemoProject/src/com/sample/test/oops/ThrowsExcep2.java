package com.sample.test.oops;

public class ThrowsExcep2 {
public static void divide(int a,int b) throws ArithmeticException {
	if(b==0) {
		throw new ArithmeticException("Cannot divide by zero");
	}
}
public static void calculate() throws ArithmeticException {
	divide(10,0);
}
	public static void main(String[] args) {
		try {
			calculate();
		}catch(ArithmeticException e) {
			System.out.println("Caugth Exception "+e.getMessage());
		}

	}

}
