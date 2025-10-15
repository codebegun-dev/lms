package com.sample.test.coreprograms;

import java.util.Scanner;

public class Practice {
//	Practice()
//	{
//		System.out.println("I am default constructor ");
//	}
//	Practice(int a){
//		System.out.println("I am parameterized constructor");
//	}
//
	public static void main(String[] args) {	
//		Practice practice=new Practice();
//		Practice practice1=new Practice(10);
//		int[][] arr=new int[3][3];
//		arr[0][0]=1;
//		arr[1][0]=2;
//		arr[2][0]=3;
//		for(int i=0;i<3;i++) {
//			for(int j=0;j<3;j++) {
//				System.out.print(arr[i][j]+" ");
//			}
//			System.out.println();
//		}
		Scanner sc=new Scanner(System.in);
		System.out.println("Enter number of rows");
		int rows=sc.nextInt();
		System.out.println("Enrter number of columns");
		int cols=sc.nextInt();
		int[][] arr=new int[rows][cols];
		System.out.println("Enter"+(rows*cols)+"numbers");
		for(int i=0;i<rows;i++) {
			for(int j=0;j<cols;j++) {
				arr[i][j]=sc.nextInt();
			}
		}
		System.out.println("2D Array");
		for(int i=0;i<rows;i++) {
			for(int j=0;j<cols;j++) {
				System.out.print(arr[i][j]+" ");		
				}
			System.out.println();
		}
		
	}
	
}
