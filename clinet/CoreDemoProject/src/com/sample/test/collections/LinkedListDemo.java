package com.sample.test.collections;

import java.util.*;

public class LinkedListDemo {

	public static void main(String[] args) {
		/*Allows duplicates,null values and maintains the insertion order ,
		 * It is not a thread safe,
		 * It is based on the doubly linked list where each element is connected with the next and previous nodes
		 *Not a thread safe */
//		LinkedList<Integer> list=new LinkedList<>();
//		list.add(30);
//		list.add(56);
//		list.add(45);
//		list.add(45);
//		list.add(null);
//		list.remove(3);
//		list.set(0, 50);
//		
//		System.out.println(list.isEmpty());
//		System.out.println(list.get(0));
//		Stack<String> fruits=new Stack<>();
//		fruits.add("apple");
//		fruits.add("Banana");
//		fruits.add("Grapes");
//		System.out.println(fruits);
		//System.out.println(fruits.remove(0));
//		System.out.println(fruits.pop());
//		System.out.println(fruits.peek());
//		System.out.println(fruits.push("Mango"));
//		System.out.println(fruits);
Vector<Integer> vec=new Vector<>();
vec.add(6);
vec.add(673);
vec.add(6);
vec.add(null);
vec.set(0, null);
System.out.println(vec);
System.out.println(vec.getLast());

	}

}
