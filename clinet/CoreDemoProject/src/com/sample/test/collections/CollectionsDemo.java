package com.sample.test.collections;
import java.util.ArrayList;
import java.util.Arrays;
public class CollectionsDemo {
	public static void main(String[] args) {
		ArrayList list=new ArrayList();
		list.add(10);
		System.out.println("The array is "+list);
		list.add(50);
		list.add(40);
		System.out.println("The second array is" +list);
		list.add(true);
		list.add(24.8);
		list.add("Hello");
		System.out.println("The third array is :"+list);
		list.get(0);
		Integer[] arr=new Integer[] {2,46,765,87,6};
		ArrayList<Integer> list1=new ArrayList<>(Arrays.asList(arr));
		list1.add(23);
		list1.add(434);
		list1.add(235);
		list1.add(23);
		list1.add(723);
		list1.add(null);
		System.out.println(list1);
		for(Integer i:list1) {
			System.out.print(i + " ");
		}
		
//		ArrayList<Integer> list2=new ArrayList<>(Arrays.asList(arr));
//		System.out.println(list2);
	}

}
