package com.sample.test.testprograms;

import java.util.Arrays;

public class Anagram {

	public static void main(String[] args) {
	String str="listen";
	String str1="silent";
	char[] arr=str.toCharArray();
	char[] arr1=str.toCharArray();
	Arrays.sort(arr);
	Arrays.sort(arr1);
	System.out.println(Arrays.equals(arr, arr1));
	}

}
