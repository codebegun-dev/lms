package com.sample.test.coreprograms;

public class PerfectNum {

	public static void main(String[] args) {
		int num=6,sum=0;
		for(int i=1;i<num;i++) {
			if(num%i==0)
			sum+=i;
		}
		System.out.println(num==sum?"Perfect":"Not Perfect");

	}
	
	

}
