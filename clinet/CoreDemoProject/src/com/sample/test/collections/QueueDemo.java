package com.sample.test.collections;

import java.util.*;

public class QueueDemo {

	public static void main(String[] args) {
/* Maintains the insertion order 
 * Allows the duplicates
 *Dosent accept the null values */
		Queue<String> queue=new PriorityQueue<>();
		queue.add("Read");
		queue.add("Write");
		queue.add("Read");
		queue.add("Read");
		queue.add("Read");
//		queue.add(null);
		System.out.println(queue);
		Queue<Integer> list =new PriorityQueue<>();
		list .add(436);
		list.add(223);
		list.add(3);
		list.add(223);
		list.add(2);
		System.out.println(list);
		Queue<Integer> list2=new ArrayDeque<>();
		/*Follows the insertion order
		 * Allows duplicate values
		 * Dosent allow null values.*/
		list2.add(41365);
		list2.add(2);
		list2.add(4454);
		list2.add(2);
		list2.remove(4454);
//		list2.add(null);
		System.out.println(list2);

	}

}
