package com.sample.test.sorting;

import java.util.Arrays;
import java.util.Scanner;

public class BubbleSort {

	public static void main(String[] args) {
		Scanner scanner=new Scanner(System.in);
		System.out.println("Enter Number of Elements");
		int n=scanner.nextInt();
		int[] arr=new int[n];
	System.out.println("Enter"+n+"numbers");
	for(int i=0;i<n;i++) {
		arr[i]=scanner.nextInt();
	}
		int flag=0;
		for(int i=0;i<n-1;i++) {
		flag=0;
		for(int j=0;j<n-i-1;j++) {
			if(arr[j]>arr[j+1]) {
				//swapping
				int temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            flag=1;
		}

	}
		
		if(flag==0) {
			break;
		}}
System.out.println("Sorted array "+Arrays.toString(arr));
	
}
}