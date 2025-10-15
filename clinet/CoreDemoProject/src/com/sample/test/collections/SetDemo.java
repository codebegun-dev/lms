package com.sample.test.collections;

import java.util.*;

public class SetDemo {

	public static void main(String[] args) {
//		Set<String> set = new HashSet<>();
//		set.add("banyan");
//		set.add("neem");	
//		set.add("mango");
//		set.add("papaya");
//		set.add("papaya");
//		System.out.println(set);
//		System.out.println(set.remove("papaya"));
//		System.out.println(set.remove("papaya"));
		Set<String> list =new TreeSet<>();
		/* In tree set the null values are not allowed*/
		list.add("Addition");
		list.add("Substraction");
		list.add("Multiplication");
		list.add("Addition");
//		list.add(null);
		System.out.println(list);
		Set<Integer> set =new TreeSet<>();
		set.add(46);
		set.add(4);
		set.add(435);
		set.add(46);
		set.add(4134);
		System.out.println(set);
		Set<String> set2=new LinkedHashSet<>();
		set2.add("rose");
		set2.add("Marigold");
		set2.add("Lilly");
		set2.add("rose");
		System.out.println(set2);
		
		
		
		
		
	}

}
