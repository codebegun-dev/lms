package com.sample.test.coreprograms;

public class FreqOfEachCaharacter {

	public static void main(String[] args) {
		String str="aabbbbcccccc";
		int[] arr=new int[256];
		for(int i=0;i<=str.length()-1;i++) {
			char ch=str.charAt(i);
			int x=(int)ch;
			arr[x]++;
		}
for(int i=0;i<256;i++) {
	if(arr[i]!=0) {
		System.out.println((char)i + "  : "+arr[i]);
	}
}
	}

}
