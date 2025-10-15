package com.sample.test.demo;

public class StringsDemo {

	public static void main(String[] args) {
		String s1="Hello world";
		String s2="hi";
		String s3=" ";
		String s4="Hello World";
		System.out.println(s2);
		System.out.println(s1.trim());
		System.out.println(s3.isBlank());
		System.out.println(s3.isEmpty());
		System.out.println(s1.equals(s3));
		System.out.println(s1==s3);
		System.out.println(s1.contains("e"));
		System.out.println(s1.startsWith("He"));
		System.out.println(s2.endsWith("h"));
		System.out.println(s1.toUpperCase());
		System.out.println(s1.toLowerCase());
		System.out.println(s1.indexOf("o"));
		System.out.println(s1.split(" "));
		System.out.println(s1.substring(2,7));
		
		System.out.println(s1.compareTo(s2));
		System.out.println(s1.length());
		System.out.println(s1.toCharArray());
        
        System.out.println(s1.compareToIgnoreCase(s4));
        System.out.println(s1.equalsIgnoreCase(s2));
        System.out.println(s2.replace("hi","hello alexa"));
        System.out.println(s3.getBytes());
        System.out.println(s4.indexOf("l", 0));
        System.out.println(s4.contentEquals("Hello World"));
        System.out.println(s1.hashCode());
        System.out.println(s2.toCharArray());
        System.out.println(s2.charAt(0));
        
	}
	

}
