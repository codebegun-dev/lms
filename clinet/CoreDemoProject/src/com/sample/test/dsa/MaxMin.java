package com.sample.test.dsa;

public class MaxMin {

	public static void main(String[] args) {
		int[] arr= {2,4,7,0,-1,45};
		int maxi=Integer.MIN_VALUE;
		int mini=Integer.MAX_VALUE;
		for(int i=0;i<arr.length;i++) {
			maxi=Math.max(maxi, arr[i]);
			mini=Math.min(mini, arr[i]);
			
		}
		System.out.println(maxi);
		System.out.println(mini);
	}

}
