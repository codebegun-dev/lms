package com.sample.test.dsa;

import java.util.HashMap;
import java.util.Map;

public class Duplicates {

	public static void main(String[] args) {
		

			
				int arr[]= {2,2,3,3,4,5,5,5,6,7,};
				HashMap<Integer,Integer> hm=new HashMap<>();
				for(int i=0;i<arr.length;i++) {
					hm.put(arr[i],hm.getOrDefault(arr[i],0)+1);
				}
				int count=0	;
				for(Map.Entry<Integer,Integer> entry:hm.entrySet()) {
						if(entry.getValue()>1) {
							System.out.println("The duplicate element is :"+entry.getKey());
							count++;
							
						}
			}
			if(count==0) {
				System.out.println("No such element is present");
			}
					
				
			}

		


	}


