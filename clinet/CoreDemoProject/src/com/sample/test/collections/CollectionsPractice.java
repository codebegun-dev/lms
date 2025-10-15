package com.sample.test.collections;

import java.util.Vector;

public class CollectionsPractice {
public static void main(String[] args) {
	Vector v1=new Vector();
	v1.add("manasa");
	v1.add("jeevan");
	v1.add(0,"raj");
	System.out.println(v1);
	Vector v2=new Vector();
	v2.add("sai");
	v2.add("sujatha");
	Vector<Integer> v3=new Vector<Integer>();
     v3.add(10);
//	v3.add("sai");
   v1.set(0,"minnu");

      //System.out.println(v2.get(0));
	//v1.addAll(v2);
	//v1.addAll(0, v2);
	System.out.println(v1);
	 //v1.remove("raj");
	 //v1.removeAll(v2);
     //v1.clear();
     //System.out.println(v1.contains("raj"));
	 //System.out.println(v2.containsAll(v3));
    //System.out.println(v2);
    //System.out.println(v1.size());
     //System.out.println(v1.capacity());

}
}
