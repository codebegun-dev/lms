package com.sample.test.oops;

public class ReverseWords {

	public static void main(String[] args) {
		String sentence="Java is my carrer";
		String words[]=sentence.split("\\s");
		for(String word:words) {
			StringBuilder sd=new StringBuilder(word);
			System.out.print(sd.reverse()+" ");
		}
		}
	}


