package com.sample.test.collections;

import java.util.*;

public class MapDemo {

	public static void main(String[] args) {
//		Map<Integer,String>  map=new HashMap();
//		map.put(1, "durga");
//		map.put(2, "manasa");
//		map.put(3, "sasi");
//		//map.clear();
//		//map.remove(3, "sasi");
//	    map.put(2, "minnu");
//	    map.put(2, "ammu");
//	    map.put(5, null);
//	    map.put(8, null);
//	    map.put(10, "kfbhbv");
//	    map.put(9, "naina");
//	    map.put(4, "nainika");
//	    map.put(6, "nainika");
//	    map.put(null, "mapp");
//	    map.put(null,"Ajay");
//		System.out.println(map);
		Map<Integer,String> dictionary=Collections.synchronizedMap(new HashMap<>()) ;
		dictionary.put(1, "remi");
		dictionary.put(2,"Manasa");
		dictionary.put(3, "Daisy");
		dictionary.put(6, "Leo");
		dictionary.put(4, "remo");
		//dictionary.put(4,"roxy");
		dictionary.put(5,"remi");
		System.out.println(dictionary);
		System.out.println(dictionary.keySet());
		System.out.println(dictionary.values());
		System.out.println(dictionary.entrySet());
		System.out.println(dictionary.get(2));
		System.out.println(dictionary.remove(4));
		System.out.println(dictionary.containsKey(3));
		System.out.println(dictionary.containsValue("Manasa"));
		System.out.println(dictionary.hashCode());
		
		for(HashMap.Entry<Integer,String> entry:dictionary.entrySet()) {
			System.out.println("Key" +entry.getKey() + " = " +" Value "+entry.getValue());
		}
		
		LinkedHashMap<Integer,String> loop=new LinkedHashMap<>();
		loop.put(1, "Marigold");
		loop.put(2, "rose");
		loop.put(8, null);
		loop.put(null, null);
		loop.put(null, "Happy");//Overrites the null .ALlows only one key
		loop.put(3, "Lilly");
		loop.put(4, "Jasmine");
		System.out.println(loop.entrySet());
		System.out.println(loop.get(4));
		System.out.println(loop.size());
		System.out.println(loop.isEmpty());
		
		for(Map.Entry<Integer,String> entry1:loop.entrySet()) {
			System.out.println("Key" + entry1.getKey()+" = "+" VAlue "+entry1.getValue());
			
		}
		TreeMap<String,String> loop3=new TreeMap<>();
		loop3.put("Daisy", null);
		loop3.put("Manasa", "bTech");
		loop3.put("Remi","Mtech");
		loop3.put("DEcky", "bee");
		loop3.put("Sai", "Btech");
		System.out.println(loop3);
		TreeMap<Integer,String> loop4=new TreeMap<>();
		loop4.put(5, "Mani");
		loop4.put(3,"Raj");
		loop4.put(4,"Rani");
		loop4.put(1,"Bala");
		loop4.put(9, "Bhavani");
		loop4.put(4,"Abhay");
		loop4.put(2, "Murali");//Overrites the duplicate value
		System.out.println(loop4);
		System.out.println(loop4.firstKey());//highest value
		System.out.println(loop4.lastKey());//lowest value
		System.out.println(loop4.ceilingKey(5));//greater or equal
		System.out.println(loop4.floorKey(9));//lessthan or equal
		System.out.println(loop4.higherKey(2));//higher key than specifeied key
		System.out.println(loop4.lowerKey(7));//lower key than specified key
		
	}

}
