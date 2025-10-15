package com.sample.test.coreprograms;

import java.util.*;

//public class ArmstrongNum {
//	public static void main(String[] args) {
//		int num=153,temp=num,sum=0;
//		while (temp!=0) {
//			int digit=temp%10;
//		 sum+=digit*digit*digit;
//		 temp/=10;
//		 }
//System.out.println(num==sum?"Armstrong number":"Not Armstrong number");		
//		
//}
//}
class Armstrong{
	public static void main(String[] args) {
		Scanner scanner=new Scanner(System.in);
		int num=scanner.nextInt(); //num=153
		int sum=0;
		int temp=num;
		int n=String.valueOf(num).length();
		while(temp!=0) {
			int digit=temp%10;
			int result=1;
			for(int i=1;i<=n;i++) {
				result*=digit;
			}
			sum+=result;
			temp/=10;
		}
		System.out.println(num==sum?"Armstrong number":"Not Armstring number");
		
	}
}
