package com.sample.test.dsa;

import java.util.Arrays;

public class ReverseArray {
	public static void main(String[] args) {
		int[] arr= {3,5,6,8,9};
		int idx1=0;
		int idx2=arr.length-1;
		while(idx1<=idx2) {
			int temp=arr[idx1];
			arr[idx1]=arr[idx2];
			arr[idx2]=temp;
			idx1++;
			idx2--;
		}
		for(int num:arr) {
			System.out.print(num+" ");
		}
		
	}

}
