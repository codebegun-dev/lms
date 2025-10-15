package com.sample.test.dsa;

import java.util.HashMap;
import java.util.Map;

public class Majority {

	public static void main(String[] args) {
		
		        int arr[] = {2, 2, 1,8,9,9,0};
		        int n = arr.length;

		        Map<Integer, Integer> map = new HashMap<>();
		        for (int num : arr) {
		            map.put(num, map.getOrDefault(num, 0) + 1);
		        }

		        for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
		            if (entry.getValue() > n / 2) {
		                System.out.println("Majority Element: " + entry.getKey());
		                return;
		            }
		        }

		        System.out.println("No Majority Element found.");
		    }
		}


	


