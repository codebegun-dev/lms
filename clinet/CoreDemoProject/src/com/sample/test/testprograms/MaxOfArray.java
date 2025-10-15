package com.sample.test.testprograms;

public class MaxOfArray {

  static int  add(int[] a) {
	int max1=0;
	int max2=1;
	if(max1>a[0]) {
		max1=a[0];
		max2=a[1];
	}else {
		max1=a[1];
		max2=a[0];
	}
	for(int i=2;i<a.length;i++) {
		if(a[i]>max1) {
			max2=max1;
			max1=a[i];
		}else if(a[i]>max2) {
			max2=a[i];
		}
	}
	return max2;
	
}
	public static void main(String[] args) {
		int[] a= {1,6,8,4,2};
		
		System.out.println("Second largest number :"+add(a));

	}

}
