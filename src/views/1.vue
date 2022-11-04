<div id="root">
    <BreadMenu :page_name="article_data.title" :fenlei="article_data.fenlei"></BreadMenu>
    <!-- 文章内容 -->
    <div class="body ylmty">
        <el-row :gutter="10">
            <el-col :xs="24" :lg="16">
                <div class="body ylmty">
                    <div class="header">
                        {{ article_data.title }}
                    </div>
                </div>
                <div class="body ylmty">
                    <div class="ylmty">
                        {{ article_data.describe }}
                    </div>
                </div>
                <div class="body ylmty">
                    <div class="article_content">
                        <v-md-preview-html :html="article_data.content" preview-class="vuepress-markdown-body">
                        </v-md-preview-html>
                    </div>
                </div>
                <div class="body ylmty">
                    <el-button v-if="toNumber(article_data.pre_id) == 0" @click="toOtherPage(article_data.pre_id)"
                        type="Info" disabled>没有上一篇了</el-button>
                    <el-button v-else @click="toOtherPage(article_data.pre_id)" type="primary">上一篇</el-button>
                    <el-button v-if="toNumber(article_data.next_id) == 0" @click="toOtherPage(article_data.next_id)"
                        type="info" disabled>没有下一篇了</el-button>
                    <el-button v-else @click="toOtherPage(article_data.next_id)" type="primary">下一篇</el-button>
                </div>
                <div class="body ylmty">
                    <h1>评论区:</h1>
                    <el-input v-model="comment" :rows="6" type="textarea" placeholder="Please input" />
                    <el-button @click="sendNewcomment()" type="primary">提交</el-button>
                    <div class="body ylmty">
                        <el-scrollbar height="800">
                            <div class="scrollbar-demo-item">
                                <span>Admin 说：</span>
                                <el-divider />
                                <p>哈哈哈哈哈哈哈哈哈</p>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </el-col>

            <el-col :xs="24" :lg="8">
                <div class="body ylmty">
                    <el-image :src="article_data.cover" :fit="'cover'" />
                </div>
                <!-- 点赞收藏打赏 -->
                <div class="body ylmty likeBtn">
                    <el-row>
                        <el-col :span="8">
                            <i class="iconfont icon-dianzan"></i>
                            <!-- <i class="iconfont icon-dianzan" style="color:#409EFF;"></i> -->
                        </el-col>
                        <el-col :span="8">
                            <i class="iconfont icon-shoucang"></i>
                            <!-- <i class="iconfont icon-shoucang" style="color:#E6A23C;"></i> -->
                        </el-col>
                        <el-col :span="8">
                            <i class="iconfont icon-dashang1"></i>
                            <!-- <i class="iconfont icon-dashang1" style="color:#E6A23C;"></i> -->
                        </el-col>
                    </el-row>
                </div>
                <!-- 评论区 -->
                <div class="body ylmty">
                    <h3>最新评论</h3>
                    <div v-for="(item, index) in comments_data" :key="index" class="body ylmty plugin-item">
                        {{ item.nickName }} 说：
                        <el-divider></el-divider>
                        {{ item.comment }}
                    </div>
                </div>

            </el-col>
        </el-row>
    </div>
</div>