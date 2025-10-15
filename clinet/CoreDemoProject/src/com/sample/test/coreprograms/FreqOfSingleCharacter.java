package com.sample.test.coreprograms;

public class FreqOfSingleCharacter {

	public static void main(String[] args) {
		String str="Java";
		int count=0;
		for(int i=0;i<=str.length()-1;i++) {
			char ch='a';
			if(str.charAt(i)==ch)
				count++;
		}
		System.out.println("The number of occurences of a in java is :"+count);
	}
}
//class CharFrequency {
//    public static void main(String[] args) {
//        String str = "Java Programming";
//
//        // Convert to lowercase to treat 'J' and 'j' as same (optional)
//        str = str.toLowerCase();
//
//        // Create an array to store frequency of characters (assuming ASCII)
//        int[] freq = new int[256]; // 256 for all ASCII characters
//
//        // Count frequency of each character
//        for (int i = 0; i < str.length(); i++) {
//            char ch = str.charAt(i);
//            // Optional: skip spaces
//            if (ch != ' ') {
//                freq[ch]++;
//            }
//        }
//
//        // Display the frequencies
//        System.out.println("Character frequencies:");
//        for (int i = 0; i < 256; i++) {
//            if (freq[i] > 0) {
//                System.out.println((char) i + " : " + freq[i]);
//            }
//        }
//    }
//}
//
