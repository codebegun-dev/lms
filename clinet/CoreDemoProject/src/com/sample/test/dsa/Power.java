package com.sample.test.dsa;

public class Power {
	long pow(long a,long b) {
		long q=pow(a,b/2)*pow(a,b/2);
		if(b==0)
			return 1;
		if(b%2==0){
			return q*q;
		
		}
		return q*q*a;
	
	}
	public static void main(String[] args) {
		Power pr=new Power();
		System.out.println(pr.pow(2,4));
		
	
		
	}
	}


