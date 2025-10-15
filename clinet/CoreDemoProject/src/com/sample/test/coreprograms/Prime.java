package com.sample.test.coreprograms;

public class Prime {

	public static void main(String[] args) {
//		int num=34;
//		int count=0;
//		if(num>1) {
//			for(int i=2;i<=num;i++) {
//				if(num%i==0)
//					count++;
//			}
//			if(count==0) {
//				System.out.println("Prime number");
//			}
//			else {System.out.println("Not a prime number");
//		}
//			
//		}else {
//			System.out.println("This is not a prime number");
//		}
		
//		int num=64;
//		boolean isPrime=true;
//		for(int i=2;i<num/2;i++)
//     if(num%i==0) {
//    	 isPrime=false;
//		break;
//     }
//	System.out.println(isPrime?"Prime":"not Prime");	
		int num=2;
		int count=0;
		if(num>0) {
			for(int i=1;i<=num;i++) {
				if(num%i==0)
					count++;
			}
			if(count==2) {
				System.out.println("Prime number");
			}else {
				System.out.println("Not prime number");
			}
		}
	}
	

}