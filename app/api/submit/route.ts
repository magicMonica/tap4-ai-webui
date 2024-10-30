/* eslint-disable import/prefer-default-export */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/db/supabase/client';
import { getServerSession } from 'next-auth';

// submit table empty -> stop

// filter status
// isFeature (priority)
// time order

// when crawler is done
// insert web_nav table (tags <- tags[0] or 'other')
// update submit table status

export async function POST(req: NextRequest) {
  try {
    // 获取用户会话
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 验证 Authorization
    // const authHeader = req.headers.get('Authorization');
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return NextResponse.json({ error: 'Authorization header is missing or malformed' }, { status: 401 });
    // }

    // const token = authHeader.split(' ')[1];
    // const submitKey = process.env.SUBMIT_AUTH_KEY;
    // const isValid = submitKey === token;
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    // }

    const supabase = createClient();

    // 从请求体中获取参数
    const { email, url, name } = await req.json();

    // 验证请求参数
    if (!email || !url || !name) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 验证提交者邮箱与登录用户一致
    if (email !== session.user.email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    }

    // 检查 URL 是否已存在
    const { data: existingEntry, error: existingEntryError } = await supabase
      .from('web_navigation')
      .select()
      .eq('url', url)
      .single();

    if (existingEntryError && existingEntryError.code !== 'PGRST116') {
      throw new Error(existingEntryError.message);
    }

    if (existingEntry) {
      return NextResponse.json({ message: 'URL already exists' });
    }

    // 插入新数据
    const { error: insertError } = await supabase.from('submit').insert({
      email,
      url,
      name,
      status: 0,
      is_feature: 0,
    });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({ message: 'Success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
