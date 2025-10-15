package com.sample.test.coreprograms;

import java.util.Arrays;

public class Anagram {

	public static void main(String[] args) {
		String str="listen";
		String str1="silent";
		char[] a1=str.toCharArray();
		char[] a2=str1.toCharArray();
		Arrays.sort(a1);
		Arrays.sort(a2);
		//System.out.println(Arrays.equals(a1,a2));
		boolean isAnagram = true;
        for (int i = 0; i < a1.length; i++) {
            if (a1[i] != a2[i]) {
                isAnagram = false;
                break;
            }
        }

        // Print result
        if (isAnagram) {
            System.out.println("Anagram");
        } else {
            System.out.println("Not Anagram");
        }

}}
