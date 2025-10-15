package com.sample.test.coreprograms;

public class VowConsonants {

	public static void main(String[] args) {
//		int vowels=0;
//		int consonants=0;
//		String str="Hello java".toLowerCase();
//		for(char c: str.toCharArray()) {
//			if(Character.isLetter(c)) {
//				if("aeiou".indexOf(c)!=-1)
//					vowels++;
//				else 
//					consonants++;
//				
//			}
//	}
//		
//		System.out.println("No of vowels"+vowels);
//		System.out.println("No of consonants"+consonants);
//}
//}
		int vowels=0;
		int consonants=0;
		String word="Happy home";
		word=word.toLowerCase();
		for(int i=0;i<word.length();i++) {
			char ch=word.charAt(i);
			if(Character.isLetter(ch)) {
				if("aeiou".indexOf(ch)!=-1) {
					vowels++;
				}else {
					consonants++;
				}
			}
		}
	System.out.println("Vowels :"+vowels);
	System.out.println("Consonants :"+consonants);
	}
	
}