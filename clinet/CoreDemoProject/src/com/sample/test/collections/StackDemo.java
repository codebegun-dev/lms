package com.sample.test.collections;

import java.util.Stack;

public class StackDemo {

	public static void main(String[] args) {
		Stack<String> books=new Stack<>();
		books.add("Red");
		books.add("Black");
		books.add("White");
		books.push("yellow");
//		System.out.println(books);
//		books.remove(1);
//		books.set(0, "yellow");
		//books.add(null);
		
		//System.out.println(books.get(1));
		//System.out.println(books.contains("Red"));
		//System.out.println(books.peek());
		//System.out.println(books.pop());
		System.out.println(books.search("White"));
		System.out.println(books.indexOf("White"));

		System.out.println(books);
	}

}
