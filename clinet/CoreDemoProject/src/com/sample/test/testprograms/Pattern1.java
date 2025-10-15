package com.sample.test.testprograms;

public class Pattern1 {

	public static void main(String[] args) {
		int rows = 4; // Number of rows

        for(int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(i + " ");
            }
            System.out.println(); // Move to next line
        }
	}

}
