package com.sample.test.coreprograms;

public class Words {

	public static void main(String[] args) {
		String str="My name is Manasa";
		String[] words=str.trim().split("\\s");
		System.out.println("No of words :" +words.length);
		
	}

}
