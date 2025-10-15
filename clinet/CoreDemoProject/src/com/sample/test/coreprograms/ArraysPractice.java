package com.sample.test.coreprograms;

import java.util.*;
import java.util.Collections;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class ArraysPractice {

	public static void main(String[] args) {
//		int[][] arr=new int[3][3];
//	arr[0][1]=4;
//	arr[2][2]=4;
//	arr[2][0]=8;
//	for(int i=0;i<3;i++) {
//		for(int j=0;j<3;j++) {
//			System.out.print(arr[i][j]+ " ");
//		}
//		System.out.println();
//	}
//		Scanner sc=new Scanner(System.in);
//		System.out.println("Enter the rows");
//		int rows=sc.nextInt();
//		System.out.println("Enter the colums");
//		int cols=sc.nextInt();
//		int[][] arr=new int[rows][cols];
//		System.out.println("Enter"+(rows*cols)+"Numbers");
//		for(int i=0;i<rows;i++) {
//			for(int j=0;j<cols;j++) {
//				arr[i][j]=sc.nextInt();
//			}
//		}
//		for(int i=0;i<rows;i++) {
//			for(int j=0;j<cols;j++) {
//				System.out.print(arr[i][j]+" ");
//			}
//			System.out.println();
//		}
//	int[] a= {2,45,76,2,1,4,2,1};
//	Set<Integer> set=new HashSet<>();
//	for(int num:a) {
//		set.add(num);
//	}
//	int[] result=new int[set.size()];
//	int i=0;
//	for(int num:set) {
//		result[i++]=num;
//		
//	}
//	System.out.println("Array after removing the duplicates" +Arrays.toString(result));
//		int[] arr= {5,7,8,4,3};
//	Arrays.sort(arr);
//	System.out.println("Sorted Array:"+Arrays.toString(arr));
//	String[] names= {"Manasa","Kittu","Sai"};
//	Arrays.sort(names);
//	System.out.println("String array  after removing duplicates"+Arrays.toString(names));
//Integer arr[]= {4,7,8,3,2,3,4};(Reversing an array)
//--Arrays.sort(arr,Collections.reverseOrder());
//Arrays.sort(arr);
//Collections.reverse(Arrays.asList(arr));(Reverse)
//System.out.println("Reversed array"+Arrays.toString(arr));
//	Integer[] arr= {4,6,2,7};
	//Arrays.sort(arr,Collections.reverseOrder());
//	Collections.reverse(Arrays.asList(arr));
//	System.out.println(Arrays.toString(arr));//(Descending Order)
		//Frequency of each element from the array
//	int[] arr= {2,3,5,2,5,3,2,5};
//	for(int i=0;i<arr.length;i++) {
//		if(arr[i]==-1)
//		continue;
//	   int count=1;
//		for(int j=i+1;j<arr.length;j++) {
//	
//			if(arr[i]==arr[j]) {
//				count++;
//				arr[j]=-1;
//			}
//			
//		}
//		System.out.println("Element "+ arr[i]+" Frequency is :"+count);
//	}
		int[] arr= {2,3,4,2,3,5,5};
		Map<Integer,Integer> freqmap=new HashMap<>();
		for(int num:arr) {
			freqmap.put(num,freqmap.getOrDefault(num,0)+1);
			
		}
		for(Map.Entry<Integer,Integer> entry:freqmap.entrySet()) {
			System.out.println("Elenent"+entry.getKey()+"Frequency is"+entry.getValue());
		}
	
}
}